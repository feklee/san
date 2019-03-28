This repo has been merged into the [SAN][1] repo as a [Git subtree][2].

To update this repo from within the SAN repo, [run][3] from the toplevel of the
SAN working tree:

    git subtree push --prefix=$PATH_OF_TREE feklee-node master

Replace `$PATH_OF_TREE` accordingly.

[1]: https://github.com/feklee/san
[2]: https://git-scm.com/book/en/v1/Git-Tools-Subtree-Merging
[3]: https://stackoverflow.com/a/55400804/282729
